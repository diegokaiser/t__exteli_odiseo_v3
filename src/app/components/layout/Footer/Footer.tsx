import { twMerge } from "tailwind-merge";

const FooterComponent = () => {
  return (
    <footer
      className={twMerge(
        "pt-[-[24px] px-[16px] pb-0 mt-[auto]"
      )}
    >
      <span className="text-[0.75rem]">
        &copy; Grupo Extranjeria GRV 🐺, invoked by Trascendiendo.digital
      </span>
    </footer>
  );
};

export default FooterComponent;
