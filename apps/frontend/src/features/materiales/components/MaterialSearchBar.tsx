import styled from "styled-components";
import Input from "../../../shared/UI/Input";

const SearchContainer = styled.div`
  width: 320px;
`;

interface MaterialSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const MaterialSearchBar = ({ value, onChange }: MaterialSearchBarProps) => {
  return (
    <SearchContainer>
      <Input
        type="text"
        value={value}
        placeholder="Buscar material..."
        onChange={(e) => onChange(e.target.value)}
      />
    </SearchContainer>
  );
};
