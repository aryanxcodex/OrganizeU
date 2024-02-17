import { React, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { CiEdit } from "react-icons/ci";
import {
  Button,
  Checkbox,
  Label,
  Modal,
  TextInput,
  Progress,
} from "flowbite-react";

const Tasks = (props) => {
  const [isHover, setHover] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);

  const handleHover = () => {
    setHover((prev) => {
      return !prev;
    });
  };

  function onCloseModal() {
    setOpenModal(false);
    setEmail("");
  }

  return (
    <>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Sign in to our platform
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Your email" />
              </div>
              <TextInput
                id="email"
                placeholder="name@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Your password" />
              </div>
              <TextInput id="password" type="password" required />
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember">Remember me</Label>
              </div>
              <a
                href="#"
                className="text-sm text-cyan-700 hover:underline dark:text-cyan-500"
              >
                Lost Password?
              </a>
            </div>
            <div className="w-full">
              <Button>Log in to your account</Button>
            </div>
            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
              Not registered?&nbsp;
              <a
                href="#"
                className="text-cyan-700 hover:underline dark:text-cyan-500"
              >
                Create account
              </a>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Draggable key={props._id} draggableId={props._id} index={props.index}>
        {(draggableProvided) => (
          <li
            className="border border-white rounded bg-white p-2"
            ref={draggableProvided.innerRef}
            {...draggableProvided.draggableProps}
            {...draggableProvided.dragHandleProps}
            key={props._id}
            onMouseEnter={handleHover}
            onMouseLeave={handleHover}
          >
            <div className="flex items-center justify-between mb-1">
              <p>{props.title}</p>
              {isHover && (
                <div
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-300 hover:cursor-pointer"
                  onClick={() => {
                    setOpenModal(true);
                  }}
                >
                  <CiEdit className="inline-block" fill="black" />
                </div>
              )}
            </div>
            <Progress progress={64} className="" size="sm" color="blue" />
          </li>
        )}
      </Draggable>
    </>
  );
};

export default Tasks;
