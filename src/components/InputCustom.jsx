import React from 'react'
import { Input } from 'antd';

const InputCustom = ({tipo, placeholder}) => {
  return (
    <div>
        <Input type={tipo} placeholder={placeholder} />
    </div>
  )
}

export default InputCustom