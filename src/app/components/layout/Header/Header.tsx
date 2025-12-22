import { twMerge } from "tailwind-merge";

const HeaderComponent = () => {
  return (
    <>
      <header 
        className={twMerge(
          "flex relative z-[1200]",
          "width: calc(100% - 280px)"
        )}
      >
        <div className="flex relative align-center min-h-[74px] pb-[8px] pt-[8px]">

        </div>
      </header>
    </>
  )
}

export default HeaderComponent
