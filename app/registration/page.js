"use client";

import { Button, Input } from "@nextui-org/react";
import { postRegisterUser } from "@/lib/apiCalls/auth.api";
import { useRouter } from "next/navigation";
import Styles from "./styles.module.scss";
import { useMemo, useState } from "react";

const Registration = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({});

  const handleChange = (e, field) => {
    setFormData({
      ...formData,
      [field]: e.target.value?.trim(),
    });
  };

  const handleRegisteration = (e) => {
    postRegisterUser(formData, () => {
      router.replace("/homepage");
    });
  };

  const IsInvalidEmail = useMemo(
    () => {
      const email= formData["email"] || "";
      if (email === "") return false;
      return !email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
    },
    [formData["email"]]
  );

  const IsInvalidName = useMemo(
    () => {
      const name= formData["name"] || "";
      if (name === "") return false;
      return !name.match(/^[A-Za-z ]*$/);
    },
    [formData["name"]]
  );

  const IsInvalidPassword = useMemo(
    () => {
      const password= formData["password"] || "";
      if (password === "") return false;
      return !(password.length >= 6);
    },
    [formData["password"]]
  );

  return (
    <form className={Styles["gg_reg_cont"]} onSubmit={handleRegisteration}>
      <header className={Styles["ggrc-heading"]}>Ganga Getaways</header>
      <Input
        className={Styles["ggrc-input"]}
        label="Name"
        type="text"
        placeholder="Enter your name"
        maxLength="35"
        isRequired
        errorMessage={IsInvalidName && "Please enter a valid name"}
        onChange={(e) => handleChange(e, "name")}
      />
      <Input
        className={Styles["ggrc-input"]}
        label="Email"
        type="email"
        placeholder="Enter your email"
        isRequired
        errorMessage={IsInvalidEmail && "Please enter a valid email"}
        onChange={(e) => handleChange(e, "email")}
      />
      <Input
        className={Styles["ggrc-input"]}
        label="Password"
        type="password"
        placeholder="Enter password"
        minLength="6"
        isRequired
        errorMessage={IsInvalidPassword && "Minimum 6 characters are required"}
        onChange={(e) => handleChange(e, "password")}
      />
      <Input
        className={Styles["ggrc-input"]}
        label="Phone number"
        type="text"
        pattern="\d*"
        value={formData["phoneNumber"]}
        placeholder="Enter your phone number"
        maxLength="10"
        isRequired
        onChange={(e) => handleChange(e, "phoneNumber")}
      />
      <Button type="submit" className={Styles["ggrc-reg-btn"]} color="primary">
        Register
      </Button>
    </form>
  );
};

export default Registration;
