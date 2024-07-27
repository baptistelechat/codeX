import lottieFiles from "../constants/lottieFiles";
import ILottieFile from "../interface/ILottieFile";

const getRandomLottieFile = (): ILottieFile => {
  const randomIndex = Math.floor(Math.random() * lottieFiles.length);
  return lottieFiles[randomIndex];
};

export default getRandomLottieFile;
