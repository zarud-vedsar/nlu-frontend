import React from "react";

const FormField = ({
  label = "",
  type = "text",
  name = "",
  placeholder = "",
  id = "",
  borderError = false,
  bottom = false,
  borderShade = "1px solid #FA5252",
  labelClass = "font-weight-semibold",
  value = "",
  className = "form-control",
  customAttributes = {},
  column = "col-md-6",
  colId = "",
  errorMessage = "",
  onChange,
  required = false,
  readOnly = false,
  list = false,
}) => {
  // Conditional style for input field
  const inputStyle = bottom
    ? { borderBottom: borderError ? "1px solid #FA5252" : {} }
    : borderError ? { border: borderShade } : {};

  return (
    <div className={`${column} form-group`} id={colId}>
      <label className={labelClass} htmlFor={id}>
        {label} {required && <span className="text-danger">*</span>} {" "}
        {readOnly &&
          <strong className="text-danger">
            <i className="fas fa-eye" />
          </strong>}
      </label>
      <input
        style={inputStyle}
        type={type}
        name={name}
        id={id}
        list={list}
        readOnly={readOnly}
        value={value}
        className={className}
        placeholder={placeholder}
        {...customAttributes}
        onChange={onChange}
      />
      {errorMessage &&
        <span className="mt-2 text-danger">
          {errorMessage}
        </span>}
    </div>
  );
};

const TextareaField = ({
  label = "",
  name = "",
  placeholder = "",
  id = "",
  borderError = false,
  borderShade = "1px solid #FA5252",
  labelClass = "font-weight-semibold",
  value = "",
  className = "form-control",
  customAttributes = {},
  column = "col-md-6",
  errorMessage = "",
  onChange,
  required = false
}) => {
  // Conditional style for textarea field
  const textareaStyle = borderError ? { border: borderShade } : {};

  return (
    <div className={`${column} form-group`}>
      <label className={labelClass} htmlFor={id}>
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <textarea
        style={textareaStyle}
        name={name}
        id={id}
        value={value}
        className={className}
        placeholder={placeholder}
        {...customAttributes}
        onChange={onChange}
      />
      {errorMessage &&
        <span className="mt-2 text-danger">
          {errorMessage}
        </span>}
    </div>
  );
};



export { FormField, TextareaField };
