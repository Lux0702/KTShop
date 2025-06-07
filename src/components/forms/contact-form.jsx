import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRouter } from "next/router";
// internal
import { CloseEye, OpenEye } from "@/svg";
import ErrorMsg from "../common/error-msg";
import { notifyError, notifySuccess } from "@/utils/toast";
import emailjs from "emailjs-com";
import Loader from "../loader/loader";
const SERVICE_ID = "service_in4n7og";
const TEMPLATE_ID = "template_tt6n8yo";
const PUBLIC_KEY = "Yi30XgEUxQWs58eq-";
// schema
const schema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  subject: Yup.string().required().label("Subject"),
  message: Yup.string().required().label("Subject"),
  remember: Yup.bool()
    .oneOf([true], "You must agree to the terms and conditions to proceed.")
    .label("Terms and Conditions"),
});

const ContactForm = () => {
  const [isSending, setIsSending] = useState(false);

    // react hook form
    const {register,handleSubmit,formState: { errors },reset} = useForm({
      resolver: yupResolver(schema),
    });
    // on submit
    const onSubmit = async (data) => {
      setIsSending(true);

      try {
        const templateParams = {
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          time: new Date().toLocaleString(),
        };

        await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

        notifySuccess("Message sent successfully!");
        reset();
      } catch (error) {
        notifyError("Failed to send message.");
        console.error(error);
      }finally{
        setIsSending(false);

      }
    };
    

  return (
    <>
      {isSending && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(255,255,255,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <Loader loading spinner="fade" />
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} id="contact-form">
        <div className="tp-contact-input-wrapper">
          <div className="tp-contact-input-box">
            <div className="tp-contact-input">
              <input
                {...register("name", { required: `Name is required!` })}
                name="name"
                id="name"
                type="text"
                placeholder="Nguyễn Thiên Khang"
              />
            </div>
            <div className="tp-contact-input-title">
              <label htmlFor="name">khangit@gmail.com</label>
            </div>
            <ErrorMsg msg={errors.name?.message} />
          </div>
          <div className="tp-contact-input-box">
            <div className="tp-contact-input">
              <input
                {...register("email", { required: `Email is required!` })}
                name="email"
                id="email"
                type="email"
                placeholder="KTShop@mail.com"
              />
            </div>
            <div className="tp-contact-input-title">
              <label htmlFor="email">Your Email</label>
            </div>
            <ErrorMsg msg={errors.email?.message} />
          </div>
          <div className="tp-contact-input-box">
            <div className="tp-contact-input">
              <input
                {...register("subject", { required: `Subject is required!` })}
                name="subject"
                id="subject"
                type="text"
                placeholder="Write your subject"
              />
            </div>
            <div className="tp-contact-input-title">
              <label htmlFor="subject">Subject</label>
            </div>
            <ErrorMsg msg={errors.subject?.message} />
          </div>
          <div className="tp-contact-input-box">
            <div className="tp-contact-input">
              <textarea
                {...register("message", { required: `Message is required!` })}
                id="message"
                name="message"
                placeholder="Write your message here..."
              />
            </div>
            <div className="tp-contact-input-title">
              <label htmlFor="message">Your Message</label>
            </div>
            <ErrorMsg msg={errors.message?.message} />
          </div>
        </div>
        <div className="tp-contact-suggetions mb-20">
          <div className="tp-contact-remeber">
            <input
              {...register("remember", {
                required: `Terms and Conditions is required!`,
              })}
              name="remember"
              id="remember"
              type="checkbox"
            />
            <label htmlFor="remember">
              Save my name, email, and website in this browser for the next time
              I comment.
            </label>
            <ErrorMsg msg={errors.remember?.message} />
          </div>
        </div>
        <div className="tp-contact-btn">
          <button type="submit">Send Message</button>
        </div>
      </form>
    </>
  );
};

export default ContactForm;