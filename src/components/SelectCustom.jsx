import React, {useState, useEffect} from "react";
import { Select } from "antd";

const SelectCustom = () => {
  const [atividade, setAtividade] = useState([]);
  useEffect(() => {
    fetch('http://localhost:8000/consultar/atividade',{
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
                <Select.Option key={item.ati_id} value={item.ati_nome}>
                    {item.ati_nome}
                </Select.Option>
            ))}
        </Select>
    </>
  );
};

export default SelectCustom;
