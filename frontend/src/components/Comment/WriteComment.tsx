import { useRef, useState, MouseEvent, ChangeEvent } from 'react';
import data from '@emoji-mart/data';
import useWebSocket from 'react-use-websocket';
import { MdOutlineEmojiEmotions } from 'react-icons/md';
/* @ts-ignore */
import Picker from '@emoji-mart/react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';
import { IReview } from '../../interfaces';
import writeCommentStyle from '../../styles/comment/WriteComment.module.scss';
import { useAppSelector } from '../../app/hooks';
import { retreiveTokens } from '../../helpers/utils';

interface IWriteCommentProps {
  isOpen: boolean;
  handleIsOpen: (isOpen: boolean) => void;
  review: IReview;
}

const WriteComment = ({ isOpen, handleIsOpen, review }: IWriteCommentProps) => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.value);
  const [textArea, setTextArea] = useState('');
  const [emojiPicker, setEmojiPicker] = useState(false);
  const handleOnChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTextArea(e.target.value);
  };
  const socketUrl = `ws://127.0.0.1:8000/ws/notification/${user.id}/?token=${
    retreiveTokens()?.access_token
  }`;

  const { sendJsonMessage } = useWebSocket(socketUrl, {
    share: true,
  });

  const cancelComment = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleIsOpen(false);
    setTextArea('');
  };

  const writeComment = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (user.id === null) {
      navigate('/login');
    }

    sendJsonMessage({ review: review.id, user: review.user.id, text: textArea });

    console.log(review);
    handleIsOpen(false);
    setTextArea('');
  };

  const handleEmojiToggle = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setEmojiPicker((prevState) => !prevState);
  };

  const handleOnEmojiSelect = (data: any) => {
    setEmojiPicker(false);
    setTextArea(textArea + data.native);
  };

  return (
    <>
      {isOpen && (
        <div className={writeCommentStyle.container}>
          <div className={writeCommentStyle.content}>
            <div
              onClick={() => handleIsOpen(false)}
              className={writeCommentStyle.closeIcon}
            >
              <AiOutlineClose />
            </div>
            <div className={writeCommentStyle.header}>
              <p>
                Commenting on {review.user.first_name} {review.user.last_name}'s review
              </p>
              <img src={review.backdrop_path} alt={review.name} />
            </div>
            <div className={writeCommentStyle.textarea}>
              <div onClick={handleEmojiToggle} className={writeCommentStyle.emojiTrigger}>
                <MdOutlineEmojiEmotions />
              </div>
              <textarea
                value={textArea}
                onChange={handleOnChange}
                placeholder="Write Comment"
              ></textarea>
            </div>
            {emojiPicker && (
              <Picker
                onClickOutside={() => setEmojiPicker(false)}
                onEmojiSelect={handleOnEmojiSelect}
                data={data}
              />
            )}
            <div className={writeCommentStyle.btnContainer}>
              <button onClick={writeComment}>Comment</button>
              <button onClick={cancelComment}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WriteComment;
