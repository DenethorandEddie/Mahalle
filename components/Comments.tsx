// @ts-nocheck
import React, { useState } from 'react';

type CommentProps = {
  initialComment?: string;
};

const Comment: React.FC<CommentProps> = ({ initialComment = '' }) => {
  const [comment, setComment] = useState(initialComment);
  const [likes, setLikes] = useState(0);

  const handleLike = () => setLikes(likes + 1);
  const handleDislike = () => setLikes(likes - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Asenkron veri gönderimi (örneğin: fetch ile veriyi sunucuya gönder) buraya eklenebilir
    console.log("Yorum gönderildi:", comment);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
      <form onSubmit={handleSubmit}>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Yorumunuzu yazın..."
          style={{ width: '100%', minHeight: '80px' }}
        />
        <div style={{ marginTop: '0.5rem' }}>
          <button type="submit" style={{ marginRight: '1rem' }}>Yorum Yaz</button>
          <button type="button" onClick={handleLike} style={{ marginRight: '0.5rem' }}>Arttır</button>
          <button type="button" onClick={handleDislike}>Azalt</button>
          <span style={{ marginLeft: '1rem' }}>Oy: {likes}</span>
        </div>
      </form>
      {/* Alt yorum sistemi eklenebilir */}
    </div>
  );
};

export default Comment;