import { FC, useCallback } from "react";
import { Button } from "~/components/ui/button";

type Role = "system" | "user" | "assistant" | "function";

type Props = {
  className?: string;
  role: Role;
  changeRole: (role: Role) => void;
};

export const RoleSelect: FC<Props> = ({ role, changeRole, className }) => {
  const onClick = useCallback(() => {
    switch (role) {
      case "system":
        changeRole("user");
        break;
      case "user":
        changeRole("assistant");
        break;
      case "assistant":
        changeRole("function");
        break;
      case "function":
        changeRole("system");
        break;
    }
  }, [changeRole, role]);

  return (
    <Button color="text" className={`${className} border-0`} onClick={onClick}>
      {role}
    </Button>
  );
};
