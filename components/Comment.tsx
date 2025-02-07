// @ts-nocheck
import React from 'react';
import {
  Box,
  Button,
  Textarea,
  VStack,
  HStack,
  Text,
  useColorModeValue,
  Divider,
  IconButton,
  Collapse,
} from '@chakra-ui/react';
import { FaThumbsUp, FaThumbsDown, FaReply } from 'react-icons/fa';
import { useCommentStore } from '../lib/store';

const Comment: React.FC = () => {
  const [comment, setComment] = React.useState('');
  const [showReplyForm, setShowReplyForm] = React.useState(false);
  const [replyText, setReplyText] = React.useState('');
  
  const { comments, addComment, addReply, updateLikes } = useCommentStore();

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      addComment(comment, 'anonymous'); // TODO: Replace with actual user ID
      setComment('');
    }
  };

  const handleReplySubmit = (commentId: string) => (e: React.FormEvent) => {
    e.preventDefault();
    if (replyText.trim()) {
      addReply(commentId, replyText, 'anonymous'); // TODO: Replace with actual user ID
      setReplyText('');
      setShowReplyForm(false);
    }
  };

  return (
    <Box maxW="container.md" mx="auto" py={8}>
      <VStack spacing={6} align="stretch">
        <Box p={6} bg={bgColor} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Yorumunuzu yazın..."
                size="md"
                resize="vertical"
              />
              <Button type="submit" colorScheme="orange" alignSelf="flex-end">
                Yorum Yaz
              </Button>
            </VStack>
          </form>
        </Box>

        <VStack spacing={4} align="stretch">
          {comments.map((comment) => (
            <Box
              key={comment.id}
              p={4}
              bg={bgColor}
              borderRadius="md"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <VStack align="stretch" spacing={3}>
                <Text>{comment.text}</Text>
                <HStack spacing={4} justify="space-between">
                  <HStack spacing={2}>
                    <IconButton
                      aria-label="Like"
                      icon={<FaThumbsUp />}
                      size="sm"
                      colorScheme="green"
                      variant="ghost"
                      onClick={() => updateLikes(comment.id, true)}
                    />
                    <Text>{comment.likes}</Text>
                    <IconButton
                      aria-label="Dislike"
                      icon={<FaThumbsDown />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => updateLikes(comment.id, false)}
                    />
                  </HStack>
                  <Button
                    size="sm"
                    leftIcon={<FaReply />}
                    variant="ghost"
                    onClick={() => setShowReplyForm(!showReplyForm)}
                  >
                    Cevapla
                  </Button>
                </HStack>

                <Collapse in={showReplyForm}>
                  <Box pt={4}>
                    <form onSubmit={handleReplySubmit(comment.id)}>
                      <VStack spacing={4}>
                        <Textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Cevabınızı yazın..."
                          size="sm"
                        />
                        <HStack spacing={2} alignSelf="flex-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setShowReplyForm(false)}
                          >
                            İptal
                          </Button>
                          <Button size="sm" colorScheme="orange" type="submit">
                            Gönder
                          </Button>
                        </HStack>
                      </VStack>
                    </form>
                  </Box>
                </Collapse>

                {comment.replies.length > 0 && (
                  <Box pl={4} mt={2}>
                    <Divider mb={4} />
                    <VStack align="stretch" spacing={3}>
                      {comment.replies.map((reply) => (
                        <Box
                          key={reply.id}
                          p={3}
                          bg={useColorModeValue('gray.50', 'gray.600')}
                          borderRadius="md"
                        >
                          <Text fontSize="sm">{reply.text}</Text>
                        </Box>
                      ))}
                    </VStack>
                  </Box>
                )}
              </VStack>
            </Box>
          ))}
        </VStack>
      </VStack>
    </Box>
  );
};

export default Comment; 