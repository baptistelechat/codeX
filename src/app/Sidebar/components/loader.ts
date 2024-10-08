const loader = () => {
  const skeleton = `<div class="flex animate-pulse items-center gap-4">
    <div class="size-10 rounded-md bg-slate-300"></div>
    <div class="size-full flex-col space-y-2">
      <div class="flex size-full flex-col gap-2">
        <div class="h-4 w-1/2 rounded-md bg-slate-300"></div>
        <div class="h-4 w-full rounded-md bg-slate-300"></div>
        </div>
      <div class="flex size-full justify-between gap-2">
      <div class="h-4 w-1/4 rounded-md bg-slate-300"></div>
        <div class="h-4 w-1/3 rounded-md bg-slate-300"></div>
        </div>
        </div>
        </div>`;

  const skeletons = Array.from({ length: 20 }, () => skeleton).join("");
  const lottieAnimation = `
      <div id="lottie-animation-10" class="lottieAnimation relative z-10 size-full px-6 py-4">
        <dotlottie-player id="loader-dotlottie-player" src="https://lottie.host/3ad18b31-d21a-4126-a571-fba2a51ca606/kizxZU1mun.lottie" background="transparent" speed="1" loop autoplay class="size-full"></dotlottie-player>
      </div>`;

  return `<div id="loader" class="hidden relative h-screen w-full overflow-hidden">
      <div class="absolute inset-0 z-0 space-y-4 blur-sm mt-20 p-4 size-full">
        ${skeletons}
      </div>
      ${lottieAnimation}
    </div>`;
};

export default loader;
