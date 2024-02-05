const bcrypt = require("bcrypt");
const auth = require("../auth");

// Models
const User = require("../models/User");

module.exports.registerUser = async (req, res) => {
  try {
    if (!req.body.email.includes("@")) {
      return res.status(400).send({ error: "Email is not valid" });
    } else if (req.body.password.length < 8) {
      return res
        .status(400)
        .send({ error: "Password must be atleast 8 characters" });
    } else if (req.body.mobileNo.length !== 11) {
      return res.status(400).send({ error: "Mobile number is not valid" });
    } else {
      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        mobileNo: req.body.mobileNo,
        password: bcrypt.hashSync(req.body.password, 10),
      });

      const user = await newUser.save();
      return res.status(201).send({ message: "Registered Successfully" });
    }
  } catch (error) {
    console.error("Error in saving:", error);
    return res.status(500).send({ error: "Error in saving user" });
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
    return res.status(500).send({ error: "Error in finding user" });
  }
};
