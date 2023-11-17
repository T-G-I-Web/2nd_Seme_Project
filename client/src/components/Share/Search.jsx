import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';


const SearchInfo = styled.div`
  position: absolute;
  width: 885px;
  height: 72px;
  left: calc(50% - 885px / 2 - 0.5px);
  top: 42px;
  background: #2a2f42;
  border: 2px solid #f4f3f3;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  font-family: 'Noto Sans KR', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 29px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f4f3f3;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: #f4f3f3;
  font-family: 'Noto Sans KR', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 29px;
  text-align: center;
  ::placeholder {
    color: #f4f3f3; /* 원하는 색상으로 변경 */
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  right: 30px; /* 원하는 위치로 조정 */
  top: 50%;
  transform: translateY(-50%);
  color: #f4f3f3;
`;

function Search() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      navigate('/page6', { state: { searchQuery: inputValue } });
    }
  };

  const handleSearchClick = () => {
    navigate('/page6', { state: { searchQuery: inputValue } });
  };

  return (
    <SearchInfo>
      <SearchInput
        type="text"
        placeholder="영화 제목을 입력하세요"
        className="search_input"
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
       <FaSearch
        onClick={handleSearchClick}
        style={{ cursor: 'pointer', fontSize: '32px', marginLeft: '-80px' }}
      />
    </SearchInfo>
  );
}

export default Search;