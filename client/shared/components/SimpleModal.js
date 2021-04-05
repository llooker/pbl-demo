import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Modal, TextField, FormControl, Button } from '@material-ui/core/';

function getModalStyle() {
  const top = 10
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${left}%, -${top}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 600,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  w100: { width: "100%" },
  mt12: {
    marginTop: 12
  }
}));

export function SimpleModal({ setRenderModal, modalInfo, helperFunctionMapper }) {
  // console.log("SimpleModal")
  // console.log({ setRenderModal })
  // console.log({ modalInfo })

  const classes = useStyles();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle);
  const [textareaValue, setTextareaValue] = useState("");
  const [processing, setProcessing] = useState(false)

  const { title, defaultValue, suggestion, button } = modalInfo.copy
  const body = (
    <div style={modalStyle} className={classes.paper} >
      <FormControl
        className={classes.w100}>
        <div>
          <h2 id="simple-modal-title">{title}</h2>

          <TextField
            id="outlined-multiline-static"
            label={suggestion}
            multiline
            rows={4}
            defaultValue={defaultValue}
            variant="outlined"
            onChange={(event) => {
              setTextareaValue(event.target.value)
            }}
            className={classes.w100}
          />
          <Button
            variant="contained"
            onClick={(event) => {
              helperFunctionMapper(event, textareaValue, modalInfo)
              setProcessing(true)
              setTimeout(() => {
                setProcessing(false)
              }, [6000])
            }}
            disabled={processing || !textareaValue.length ? true : false}
            className={`${classes.mt12}`}
          >{button}</Button></div>
      </FormControl>

    </div>
  );

  return (
    <div>
      <Modal
        open={true}
        onClose={() => {
          setRenderModal(false)
        }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}
