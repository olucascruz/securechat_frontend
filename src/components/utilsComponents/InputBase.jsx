import styled from 'styled-components';
const StyledInput = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 5px;
  outline: none;

  &:focus {
    border-color: dodgerblue;
    box-shadow: 0 0 5px rgba(0, 0, 255, 0.5);
  }
`;

export function InputBase({ name, id, placeholder }) {
    
    return(<>
        <StyledInput required type="text" name={name} id={id} placeholder={placeholder} />
        </>)
}