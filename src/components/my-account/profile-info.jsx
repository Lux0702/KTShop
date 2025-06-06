import React, {useState} from 'react';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import * as Yup from "yup";
// internal
import ErrorMsg from '../common/error-msg';
import { EmailTwo, LocationTwo, PhoneThree, UserThree } from '@/svg';
import { useUpdateProfileMutation } from '@/redux/features/auth/authApi';
import { notifyError, notifySuccess } from '@/utils/toast';
import { useUploadImageMutation } from '@/redux/features/admin/cloudinaryApi';
// yup  schema
const schema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  phone: Yup.string().required().min(11).label("Phone"),
  address: Yup.string().required().label("Address"),
  bio: Yup.string().required().min(20).label("Bio"),
});

const ProfileInfo = () => {
  const { user } = useSelector((state) => state.auth);
console.log("user profile info:", user)
  const [updateProfile, {}] = useUpdateProfileMutation();
  // react hook form
  const {register,handleSubmit,formState: { errors },reset} = useForm({
    resolver: yupResolver(schema),
  });
  const [uploadImage] = useUploadImageMutation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageError, setImageError] = useState("");
  // on submit
  const onSubmit = async (data) => {
    let imageUrl = user?.image_url || "";

    try {
      if (selectedImage) {
        const formData = new FormData();
        formData.append("file", selectedImage);

        const res = await uploadImage(formData).unwrap();
        imageUrl = res.url; // ← đảm bảo response trả về field này
      }

      const result = await updateProfile({
        id: user?.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        bio: data.bio,
        image_url: imageUrl,
      });

      if (result?.error) {
        notifyError(result?.error?.data?.message);
      } else {
        notifySuccess(result?.data?.message);
      }

      reset();
      setSelectedImage(null);
    } catch (err) {
      console.error(err);
      setImageError("Failed to upload image.");
    }
  };
  
  return (
    <div className="profile__info">
      <h3 className="profile__info-title">Personal Details</h3>
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
        >
          Chọn ảnh đại diện
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedImage(e.target.files[0])}
          style={{
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            width: "100%",
          }}
        />
        {imageError && (
          <div style={{ color: "red", marginTop: "5px" }}>{imageError}</div>
        )}

        {selectedImage && (
          <div style={{ marginTop: "10px" }}>
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Preview"
              style={{ maxWidth: "200px", borderRadius: "8px" }}
            />
          </div>
        )}
      </div>

      <div className="profile__info-content">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-xxl-6 col-md-6">
              <div className="profile__input-box">
                <div className="profile__input">
                  <input
                    {...register("name", { required: `Name is required!` })}
                    name="name"
                    type="text"
                    placeholder="Enter your username"
                    defaultValue={user?.name}
                  />
                  <span>
                    <UserThree />
                  </span>
                  <ErrorMsg msg={errors.name?.message} />
                </div>
              </div>
            </div>

            <div className="col-xxl-6 col-md-6">
              <div className="profile__input-box">
                <div className="profile__input">
                  <input
                    {...register("email", { required: `Email is required!` })}
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    defaultValue={user?.email}
                  />
                  <span>
                    <EmailTwo />
                  </span>
                  <ErrorMsg msg={errors.email?.message} />
                </div>
              </div>
            </div>

            <div className="col-xxl-12">
              <div className="profile__input-box">
                <div className="profile__input">
                  <input
                    {...register("phone", { required: true })}
                    name="phone"
                    type="text"
                    placeholder="Enter your number"
                    defaultValue="097 956 9098"
                  />
                  <span>
                    <PhoneThree />
                  </span>
                  <ErrorMsg msg={errors.phone?.message} />
                </div>
              </div>
            </div>

            <div className="col-xxl-12">
              <div className="profile__input-box">
                <div className="profile__input">
                  <input
                    {...register("address", { required: true })}
                    name="address"
                    type="text"
                    placeholder="Enter your address"
                    defaultValue="01 Võ Văn Ngân"
                  />
                  <span>
                    <LocationTwo />
                  </span>
                  <ErrorMsg msg={errors.address?.message} />
                </div>
              </div>
            </div>

            <div className="col-xxl-12">
              <div className="profile__input-box">
                <div className="profile__input">
                  <textarea
                    {...register("bio", { required: true })}
                    name="bio"
                    placeholder="Enter your bio"
                    defaultValue="Hi there, this is my bio..."
                  />
                  <ErrorMsg msg={errors.bio?.message} />
                </div>
              </div>
            </div>
            <div className="col-xxl-12">
              <div className="profile__btn">
                <button type="submit" className="tp-btn">
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileInfo;