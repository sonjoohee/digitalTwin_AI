//이메일 양식 확인, 비밀번호 조건(8~16자, 영문.특문.숫자 중 2개 이상)
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
  
export const isValidPassword = (password) => {
  const minLength = 8;
  const maxLength = 16;
  if (password.length < minLength || password.length > maxLength) {
    return false;
  }

  const hasLetters = /[a-zA-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const validConditions = [hasLetters, hasNumbers, hasSpecial].filter(Boolean).length;
  return validConditions >= 2;
};