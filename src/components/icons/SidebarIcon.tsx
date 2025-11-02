interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  isCollapsed?: boolean;
}

export const SidebarIcon: React.FC<IconProps> = ({
  size = 20,
  className = "",
  isCollapsed = false,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      className={className + " sidebar-trigger"}
      fill="currentColor"
      {...props}
    >
      <path d="M14 2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2z" />
      {/* <rect x="2" y="3" width="12" height="3" rx="1" /> */}
      <rect
        className={`${isCollapsed && "w-[3px] group-has-[.sidebar-trigger:hover]:w-[6px] group-has-[.sidebar-wrapper:hover]:w-[6px]"} ${!isCollapsed && "w-[6px] group-has-[.sidebar-icon-trigger:hover]:w-[3px]"} transition-all duration-150 ease-in-out`}
        x="2"
        y="3"
        height="10"
        rx="1"
      />
    </svg>
  );
};
