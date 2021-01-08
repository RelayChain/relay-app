import {
  FormikSelectInput,
  IFormikSelectInputProps,
} from "@chainsafe/common-components";
import React, { useEffect, useState } from "react";

import { Tokens } from "../../Web3Context/tokensReducer";
import { useField } from "formik";

interface ITokenSelectInput extends IFormikSelectInputProps {
  tokens: Tokens;
  sync?: (value: string) => void;
}

const TokenSelectInput: React.FC<ITokenSelectInput> = ({
  className,
  label,
  name,
  tokens,
  sync,
  ...rest
}: ITokenSelectInput) => {
  const [field] = useField(name);
  const labelParsed = tokens[field.value]
    ? `${label} ${tokens[field.value]?.balance} ${tokens[field.value]?.symbol}`
    : "Please select token";

  const [synced, setSynced] = useState();
  useEffect(() => {
    if (sync && field.value !== synced) {
      setSynced(field.value);
      if (field.value !== "") {
        sync(field.value);
      }
    }
    // eslint-disable-next-line
  }, [field]);

  return (
    <FormikSelectInput
      name={name}
      className={className}
      label={labelParsed}
      {...rest}
    />
  );
};

export default TokenSelectInput;
