const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

const registerUser = asyncHandler(async (req, res) => {
  const { nama, noHP, email, password, confirmPassword, ktp, statusValidate } =
    req.body;

  if (!noHP) {
    res.status(400).json({
      success: false,
      message: "NoHP tidak boleh kosong",
    });
    return;
  } else if (!/^\d+$/.test(noHP)) {
    res.status(400).json({
      success: false,
      message: "Nomor HP hanya boleh di isi dengan angka",
    });
    return;
  } else if (noHP.length < 9 || noHP.length > 13) {
    res.status(400).json({
      success: false,
      message:
        "Silahkan isi nomor HP dengan benar, minimal 9 dan maksimal 13 angka",
    });
    return;
  }

  const userExists = await UserModel.findOne({ email });
  if (userExists) {
    res.status(400).json({
      success: false,
      message: "User akun sudah tersedia",
    });
    return;
  }

  if (!nama) {
    res.status(400).json({
      success: false,
      message: "Nama tidak boleh kosong",
    });
    return;
  }

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    res.status(400).json({
      success: false,
      message: "Email harus valid",
    });
    return;
  }

  if (!password) {
    res.status(400).json({
      success: false,
      message: "Password tidak boleh kosong",
    });
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).json({
      success: false,
      message: "Password tidak sesuai",
    });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await UserModel.create({
    nama,
    noHP,
    email,
    password: hashedPassword,
    ktp,
    statusValidate: false,
  });

  if (user) {
    res.status(201).json({
      success: true,
      data: {
        _id: user.id,
        nama: user.nama,
        noHP: user.noHP,
        email: user.email,
        token: generateAccessToken(user.id),
      },
      message: "Registrasi berhasil",
      status: 201,
    });
  } else {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("Email tidak valid");
  }

  if (user && (await bcrypt.compare(password, user.password))) {
    return res.status(200).json({
      success: true,
      data: {
        accessToken: generateAccessToken(user.id),
        refreshToken: generateRefreshToken(user.id),
      },
      message: "Login berhasil",
      status: 200,
    });
  } else {
    res.status(400);
    throw new Error("Password tidak valid");
  }
});

const getUser = asyncHandler(async (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    data: {
      _id: user.id,
      nama: user.nama,
      noHP: user.noHP,
      email: user.email,
      ktp: user.ktp,
      statusValidate: user.statusValidate,
    },
    message: "Get user success",
    status: 200,
  });
});

const validateAccount = async (req, res) => {
  let updatedUser;

  try {
    const userId = req.user.id;
    const { deskripsi } = req.body;
    const ktpFileName = req.file ? req.file.filename : null;

    if (!deskripsi && !ktpFileName) {
      return res.status(400).json({
        success: false,
        message: "Mohon masukkan deskripsi dan/atau unggah foto KTP",
      });
    }

    const updateObject = {};
    if (deskripsi) {
      updateObject.deskripsi = deskripsi;
    }
    if (ktpFileName) {
      updateObject.ktp = `${process.env.BASE_URL}/ktp/${ktpFileName}`;
      updateObject.statusValidate = true;
    }

    updatedUser = await UserModel.findByIdAndUpdate(userId, updateObject, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Pengguna tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: updatedUser.id,
        nama: updatedUser.nama,
        noHP: updatedUser.noHP,
        email: updatedUser.email,
        deskripsi: updatedUser.deskripsi,
        fotoKtp: updatedUser.ktp,
        statusValidate: updatedUser.statusValidate,
      },
      message: "Validasi akun berhasil",
      status: 200,
    });
  } catch (error) {
    console.error(error);

    if (!updatedUser) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
};

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  validateAccount,
};
