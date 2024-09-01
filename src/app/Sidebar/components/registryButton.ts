const registryButton = (
  hideRegistries: ("npm" | "packagist")[],
  registry: "npm" | "packagist",
  dependenciesCount: number
) => {
  const isRegistryHidden = hideRegistries.includes(registry);

  return `<div id="registry-${registry}" class="action-item registry-action-item ${
    dependenciesCount > 0 ? "flex" : "hidden"
  } ${
    !isRegistryHidden ? "hover:brightness-90" : ""
  } w-fit items-center justify-center rounded py-1.5 px-2 bg-[--vscode-toolbar-hoverBackground] hover:cursor-pointer">
        <div class="${
          isRegistryHidden ? "brightness-50" : ""
        } registry-data flex items-center justify-center gap-1">
          <div class="size-2.5 rounded-full ${
            registry === "npm" ? "bg-red-400" : "bg-yellow-400"
          }"></div>
          <p id="${registry}-dependencies" class="font-semibold italic">${dependenciesCount}</p>
        </div>
        <div class="tooltip tooltip-registry-subtitle tooltip-registry-${registry}-subtitle">${
    registry === "npm" ? "Npm" : "Packagist"
  }</div>
      </div>`;
};

export default registryButton;
