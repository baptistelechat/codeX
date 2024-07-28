import lottieFiles from "../constants/lottieFiles";
import ILottieFile from "../interface/ILottieFile";

const getRandomLottieFile = (): ILottieFile => {
  const validLottieFiles = lottieFiles.filter(
    (lottieFile) => lottieFile.url !== ""
  );
  const randomIndex = Math.floor(Math.random() * validLottieFiles.length);
  return validLottieFiles[randomIndex];
};

export default getRandomLottieFile;
