type AuthError = {
  code?: string | undefined | undefined;
  message?: string | undefined | undefined;
  status: number;
  statusText: string;
};

export function getThaiAuthError(error: AuthError) {
  //   console.log(error?.code);
  switch (error?.code) {
    case "INVALID_USERNAME_OR_PASSWORD":
      return "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
    case "BANNED_USER":
      return "บัญชีนี้ถูกระงับการใช้งาน";
    case "USERNAME_IS_ALREADY_TAKEN_PLEASE_TRY_ANOTHER":
      return "ชื่อผู้ใช้(Username) นี้ถูกใช้งานแล้ว";
    case "USER_NOT_APPROVED":
      return error?.message;
    case "USER_DISABLED":
      return error?.message;
    case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
      return "อีเมล์นี้ถูกใช้งานแล้ว";
    case "CID_ALREADY_EXISTS_USE_ANOTHER_CID":
      return error?.message;
    default:
      return `${error?.code}:${error?.message}`;
  }
}
