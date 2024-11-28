
import {Request, Response} from "express"
import User from "../models/user.model"
import { generateRandomString , generateRandomNumber} from "../helpers/generateHelper"
import md5 from "md5"

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { fullName, email, password } = req.body;
    
        const emailExist = await User.findOne({
          email: email,
          deleted: false,
        });
        if (emailExist) {
           res.json({
            code: 400,
            message: "Email đã tồn tại",
          });
          return
        }
        const token  = generateRandomString(30);
        const user = new User({
          fullName: fullName,
          email: email,
          password: md5(password),
          token: token
        });
        await user.save();
        res.cookie("token", token);
    
        res.json({
          code: 200,
          message: "Tạo tài khoản thành công",
          token: token
        });
      } catch (error) {
        res.json({
          code: 400,
          message: "Tạo tài khoản thất bại",
        });
      }
  };
  



  // [POST] localhost:3000/users/login
  export const login = async (req, res) => {
 
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email: email,
      deleted: false,
    });
    if (!user) {
      return res.json({
        code: 400,
        message: "Email không tồn tại",
      });
    }
    if (md5(password) != user.password) {
      return res.json({
        code: 400,
        message: "Mật khẩu không chính xác",
      });
    }

    res.cookie("token", user.token);

    res.json({
      code: 200,
      message: "Đăng nhập thành công",
      token: user.token,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Đăng nhập thất bại",
    });
  }
};



// [GET] localhost:3000/users/detail
export const detail = async (req, res) => {
  try {
    const id = req.params.id
    const user = await User.findOne({
      _id: id,
      deleted: false
    }).select("-password -token");
    res.json({
      code: 200,
      user: user
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lấy thông tin thất bại",
    });
  }
};