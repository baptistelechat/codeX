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

  return `<div id="loader" class="hidden relative h-screen w-full overflow-hidden">
      <div class="absolute inset-0 z-0 space-y-2 blur-sm mt-20 p-4 size-full">
        ${skeletons}
      </div>
      <div class="relative z-10 size-full p-4">
        <dotlottie-player src="https://lottie.host/69705bbe-c1a2-452c-bfe5-50bde057f547/v94H0QiYgu.lottie" background="transparent" speed="1" loop autoplay class="size-full"></dotlottie-player>
      </div>
    </div>`;
};

export default loader;
