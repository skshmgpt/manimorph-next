export const LoadingMessage = () => {
  return (
    <div className="mb-4 p-3 rounded-lg text-black dark:text-white">
      <div className="font-bold mb-1">Manimorph</div>
      <div className="animate-pulse flex items-center">
        <span className="ml-2">Generating...</span>
      </div>
    </div>
  );
};
