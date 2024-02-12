const bcrypt = require("bcrypt");
const auth = require("../auth");

// Models
const User = require("../models/User");

module.exports.createUser = async (req, res) => {
  const { email } = req.body;
  try {
    if (!req.body.email.includes("@")) {
      return res.status(400).send({ error: "Email is not valid" });
    }

    if (req.body.password.length < 8) {
      return res
        .status(400)
        .send({ error: "Password must be atleast 8 characters" });
    }

    if (req.body.mobileNo.length !== 11) {
      return res.status(400).send({ error: "Mobile number is not valid" });
    }

    const userFound = await User.findOne({ email: email });

    if (userFound) {
      return res.status(400).send({ error: "Email already exist" });
    }

    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      mobileNo: req.body.mobileNo,
      password: bcrypt.hashSync(req.body.password, 10),
    });

    const user = await newUser.save();
    user.password = undefined;
    return res.status(201).send({ message: "Registered Successfully", user });
  } catch (error) {
    console.error("Error in saving:", error);
    return res
      .status(500)
      .send({ error: "Internal Server Error: Occured while saving user" });
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email.includes("@")) {
      return res.status(400).send({ error: "Invalid Email" });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).send({ error: "No Email Found" });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    if (isPasswordCorrect) {
      return res.status(200).send({ access: auth.createAccessToken(user) });
    } else {
      return res
        .status(401)
        .send({ message: "Email and password do not match" });
    }
  } catch (error) {
    console.error("Error in finding user: ", error);
    return res
      .status(500)
      .send({ error: "Internal Server Error: Occured while finding user" });
  }
};

module.exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    const foundUser = await User.findById(userId);

    if (!foundUser) {
      return res.status(404).send({ error: "User not found" });
    }

    foundUser.password = undefined;
    return res.status(200).send({ user: foundUser });
  } catch (error) {
    console.error("Error in fetching user details: ", error);
    return res.status(500).send({
      error: "Internal Server Error: Occurred while fetching user details",
    });
  }
};

module.exports.updateUserAsAdmin = async (req, res) => {
  console.log(req.params);
  const { userId } = req.params;

  try {
    const foundUser = await User.findById(userId);

    if (!foundUser) {
      return res.status(404).send({ error: "User not found" });
    }

    if (foundUser.isAdmin) {
      return res.status(400).send({ error: "User is already an Admin" });
    }

    foundUser.isAdmin = true;
    await foundUser.save();
    return res
      .status(200)
      .send({ message: "User updated successfully as an admin" });
  } catch (error) {
    console.error("Error updating user as admin:", error);
    return res.status(500).send({
      error: "Internal Server Error: Occured while updating user as admin",
    });
  }
};

module.exports.updatePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { id } = req.user;

    if (newPassword.length < 8) {
      return res
        .status(400)
        .send({ error: "Password must be atleast 8 characters" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(id, {
      password: hashedPassword,
    });

    return res.status(200).send({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating user password:", error);
    return res.status(500).send({
      error: "Internal Server Error: Failed to update password",
    });
  }
};
