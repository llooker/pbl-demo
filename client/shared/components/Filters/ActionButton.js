import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Modal, Fade } from '@material-ui/core'
import { EmbedMethodHighlight } from '../Accessories/Highlight';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export const ActionButton = ({ classes, filterItem }) => {
  console.log("ActionButton")

  const modalClasses = useStyles();
  const [open, setOpen] = useState(false);
  const [modalStyle] = useState(getModalStyle);


  return (
    <EmbedMethodHighlight classes={classes} >
      <Button onClick={() => {
        setOpen(true)
      }}>{filterItem.label}</Button>

      < Modal
        className={`${classes.modal} `}
        onClose={() => setOpen(false)}
        open={open}
      >
        <Fade in={true}>
          <div style={modalStyle} className={modalClasses.paper}>
            <h2 id="simple-modal-title">Text in a modal</h2>
            <p id="simple-modal-description">
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
      </p>
          </div>
        </Fade></Modal>
    </EmbedMethodHighlight>
  )
}
