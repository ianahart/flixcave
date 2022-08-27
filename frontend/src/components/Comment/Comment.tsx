import { BsThreeDots } from 'react-icons/bs';
import { useCallback, useState, useRef } from 'react';
import { useAppSelector } from '../../app/hooks';
import { IComment } from '../../interfaces';
import commentStyle from '../../styles/comment/Comment.module.scss';
import { useEffectOnce } from '../../hooks/UseEffectOnce';
import { AxiosError } from 'axios';
import { http } from '../../helpers/utils';

interface ICommentProps {
  comment: IComment;
  reviewUserId: number;
  removeComment: (id: number) => void;
}

const Comment = ({ reviewUserId, comment, removeComment }: ICommentProps) => {
  const user = useAppSelector((state) => state.user.value);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const clickAway = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      const target = e.target as Element;
      if (menuRef.current !== null) {
        if (!menuRef.current.contains(target) && target !== triggerRef.current) {
          setOptionsOpen(false);
        }
      }
    },
    [setOptionsOpen]
  );

  useEffectOnce(() => {
    window.addEventListener('click', clickAway);
    return () => window.addEventListener('click', clickAway);
  });

  const handleDelete = async (id: number) => {
    try {
      removeComment(id);
      await http.delete(`/comments/${id}/`);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  return (
    <div className={commentStyle.container}>
      <div className={commentStyle.initials}>{comment.user.initials}</div>
      <div className={commentStyle.headerContainer}>
        <div className={commentStyle.header}>
          <h3>
            {comment.user.first_name} {comment.user.last_name}
          </h3>
          <p>{comment.text}</p>
        </div>

        <p className={commentStyle.date}>{comment.readable_date} </p>
      </div>
      {comment.user.id === user.id && (
        <div className={commentStyle.options}>
          <div ref={triggerRef} onClick={() => setOptionsOpen((prevState) => !prevState)}>
            <BsThreeDots />
          </div>
          {optionsOpen && (
            <div
              onClick={() => handleDelete(comment.id)}
              ref={menuRef}
              className={commentStyle.actions}
            >
              <p>Delete</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Comment;
