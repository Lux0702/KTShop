import React, { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { Upload, Button, Image, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

// internal
import ErrorMsg from "@/components/common/error-msg";
import { EmailTwo, LocationTwo, PhoneThree, UserThree } from "@/svg";
import { useUpdateProfileMutation } from "@/redux/features/auth/authApi";
import { useUploadImageMutation } from "@/redux/features/admin/cloudinaryApi";
import { notifyError, notifySuccess } from "@/utils/toast";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { userLoggedIn } from "@/redux/features/auth/authSlice"; // import action để cập nhật store


// Yup schema
const schema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  phone: Yup.string().required().min(10).label("Phone"),
  address: Yup.string().required().label("Address"),
  bio: Yup.string().required().min(20).label("Bio"),
});

const ProfileInfo = () => {
  const { user } = useSelector((state) => state.auth);
  const [updateProfile] = useUpdateProfileMutation();
  const [uploadImage] = useUploadImageMutation();
  const [imageUrl, setImageUrl] = useState(user?.image_url || "");
  const [preview, setPreview] = useState(user?.image_url || "");
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleUpload = async ({ file, onSuccess, onError }) => {
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadImage(formData).unwrap();
      const url = res.data?.url || res.secure_url;
      setImageUrl(url);
      onSuccess("ok");
      message.success("Upload ảnh thành công!");
    } catch (err) {
      onError("error");
      message.error("Tải ảnh thất bại");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
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
        const { user: updatedUser, token } = result.data.data;

        Cookies.set(
        "userInfo",
        JSON.stringify({
          accessToken: token,
          user: updatedUser,
        }),
        { expires: 0.5 } // 12 giờ
      );

      // ✅ Cập nhật lại Redux store
      dispatch(userLoggedIn({ accessToken: token, user: updatedUser }));
        notifySuccess(result?.data?.message || "Cập nhật thành công!");
      }

      reset();
    } catch (err) {
      console.error(err);
      message.error("Cập nhật thất bại");
    }
  };

  return (
    <div className="profile__info">
      <h3 className="profile__info-title">Personal Details</h3>

      <Upload
        customRequest={handleUpload}
        showUploadList={false}
        accept=".jpg,.jpeg,.png"
        disabled={uploading}
      >
        <Button icon={<UploadOutlined />} loading={uploading}>
          Upload Avatar
        </Button>
      </Upload>

      {preview && (
        <Image
          src={preview}
          width={100}
          style={{ marginTop: 10, borderRadius: 8 }}
          alt="Preview Avatar"
        />
      )}

      <div className="profile__info-content" style={{ marginTop: 20 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-xxl-6 col-md-6">
              <div className="profile__input-box">
                <div className="profile__input">
                  <input
                    {...register("name")}
                    defaultValue={user?.name}
                    placeholder="Enter your username"
                  />
                  <span><UserThree /></span>
                  <ErrorMsg msg={errors.name?.message} />
                </div>
              </div>
            </div>

            <div className="col-xxl-6 col-md-6">
              <div className="profile__input-box">
                <div className="profile__input">
                  <input
                    {...register("email")}
                    defaultValue={user?.email}
                    placeholder="Enter your email"
                  />
                  <span><EmailTwo /></span>
                  <ErrorMsg msg={errors.email?.message} />
                </div>
              </div>
            </div>

            <div className="col-xxl-12">
              <div className="profile__input-box">
                <div className="profile__input">
                  <input
                    {...register("phone")}
                    defaultValue={user?.phone || ""}
                    placeholder="Enter your number"
                  />
                  <span><PhoneThree /></span>
                  <ErrorMsg msg={errors.phone?.message} />
                </div>
              </div>
            </div>

            <div className="col-xxl-12">
              <div className="profile__input-box">
                <div className="profile__input">
                  <input
                    {...register("address")}
                    defaultValue={user?.address || ""}
                    placeholder="Enter your address"
                  />
                  <span><LocationTwo /></span>
                  <ErrorMsg msg={errors.address?.message} />
                </div>
              </div>
            </div>

            <div className="col-xxl-12">
              <div className="profile__input-box">
                <div className="profile__input">
                  <textarea
                    {...register("bio")}
                    defaultValue={user?.bio || ""}
                    placeholder="Enter your bio"
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
