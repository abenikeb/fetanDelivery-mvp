//Email

import { json } from "body-parser";

//notification

//otp
export const GenerateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000) as number;
  let expiry = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);

  return { otp, expiry };
};

export const onRequestOtp = async (otp: number, toPhoneNumber: string) => {
  const acountSid = "";
  const authToken = "";
  const client = require("twilo")(acountSid, authToken);

  const resopnse = await client.messages.create({
    body: `Your OTP is ${otp}`,
    from: "+17752547626",
    to: `+251${toPhoneNumber}`,
  });

  //return resopnse
  return "Your otp Request Has Been...";
};

// payment notification / email
