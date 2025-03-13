export type dataObj = {
  name: string;
  email: string;
  password: string;
};

export type InputBoxProps = {
  name: string;
  onDataChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string | number;
  placeholder: string;
  required?: boolean;
};
