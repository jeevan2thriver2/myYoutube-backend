import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // Dummy Response
  //   res.status(200).json({
  //     message: "As you Grow You Change, as You Change You Grow",
  //   });

  // get user details from frontend
  // validation - not empty
  // check if user already exits: username, email
  // check for images, check for avatar
  // upload them to cloudinary,
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { fullName, email, username, password } = req.body;
  console.log(`Email: ${email}`);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const existingUserName = await User.findOne({ username });

  const existingEmail = await User.findOne({ email });

  if (existingUserName) {
    throw new ApiError(409, "username already exists");
  }

  if (existingEmail) {
    throw new ApiError(409, "Email already exits");
  }

  console.log(req.files?.avatar[0]?.path);
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password - refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something Went Wrong while registering the user.");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Succesfully"));
});

export default registerUser;
