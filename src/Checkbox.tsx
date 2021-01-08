import React from 'react'

interface Props {
  labelOn: string
  labelOff: string
}

const Checkbox: React.FC<Props> = (props) => {
  const [isChecked, setCheckedStatus] = React.useState<boolean>(false)

  const onChange = (): void => {
    setCheckedStatus(!isChecked)
  }

  return (
    <label>
      <input type="checkbox" checked={isChecked} onChange={onChange} />
      {isChecked ? props.labelOn : props.labelOff}
    </label>
  )
}

export default Checkbox
