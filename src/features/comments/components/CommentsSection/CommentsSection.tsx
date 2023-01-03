import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';

import { Comment } from '@/features/comments';
import { useComments, useCreateComment } from '@/features/comments/api';
import { useBoolean, useToast } from '@/hooks';
import { client } from '@/libs';

export interface CommentsSectionProps {
  threadId: string;
}

export const CommentsSection = ({ threadId }: CommentsSectionProps) => {
  const toast = useToast();
  const { data: comments } = useComments(threadId);
  const { mutate: createComment } = useCreateComment();
  const [message, setMessage] = useState('');
  const { state: isLoading, setState: setIsLoading } = useBoolean();

  const handleCreateComment = () => {
    if (!client.authStore.model?.id) return;

    setIsLoading(true);
    createComment(
      { message, thread: threadId, owner: client.authStore.model?.id },
      {
        onSuccess: () => {
          setMessage('');
        },
        onError: () => {
          toast({
            title: 'Unable to create comment.',
            status: 'error',
          });
        },
        onSettled: () => {
          setIsLoading(false);
        },
      }
    );
  };

  const isError = message.length > 10000;

  return (
    <VStack align="flex-start">
      <VStack align="flex-start">
        {comments?.length === 0 && <Text colorScheme="gray">No messages.</Text>}
        {comments?.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </VStack>
      <FormControl isInvalid={isError}>
        <FormLabel>Write a message</FormLabel>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message here."
        />
        <Flex justify="space-between" mt={2}>
          <Button
            colorScheme="blue"
            onClick={handleCreateComment}
            isLoading={isLoading}
          >
            Send
          </Button>
          <Text color={isError ? 'red' : 'gray'}>
            {message.length.toLocaleString()}/10,000
          </Text>
        </Flex>
      </FormControl>
    </VStack>
  );
};
