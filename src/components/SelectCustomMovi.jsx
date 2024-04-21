import React, {useState, useEffect} from "react";
import { Select } from "antd";

const SelectCustomMovi = () => {
  const [atividade, setAtividade] = useState([]);
  useEffect(() => {
    fetch('http://localhost:8000/consultar/movimentacao',{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
    }})
      .then(response => response.json())
      .then(data => setAtividade(data))
      .catch(error => console.error('Erro ao buscar dados da API:', error));
  }, [])

  console.log(atividade);
  return (
    <>
        <Select>
            {atividade.map((item) => (
                <Select.Option key={item.mov_id} value={item.mov_nome}>
                    {item.mov_nome}
                </Select.Option>
            ))}
        </Select>
    </>
  );
};

export default SelectCustomMovi;
