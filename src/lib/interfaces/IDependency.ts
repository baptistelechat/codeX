interface IDependency {
  id: string;
  registry: "npm" | "packagist";
}

export default IDependency;
