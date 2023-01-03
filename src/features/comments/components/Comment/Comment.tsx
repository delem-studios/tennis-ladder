import { Avatar, Box, Flex, Text, Tooltip } from '@chakra-ui/react';
import dayjs from 'dayjs';
import React from 'react';

import { ExpandedComment } from '@/features/comments';

export interface CommentProps {
  comment: ExpandedComment;
}

export const Comment = ({ comment }: CommentProps) => {
  const owner = comment.expand.owner;

  return (
    <Flex>
      <Box pt={1}>
        <Avatar mr={3} name={owner.name} src={owner.avatar} size="sm" />
      </Box>
      <Box>
        <Flex>
          <Text fontWeight="bold" mr={2}>
            {owner.name}
          </Text>
          <Tooltip
            label={dayjs(comment.created).format('dddd, MMMM D, YYYY h:mm A')}
          >
            <Text color="gray">{dayjs(comment.created).fromNow()}</Text>
          </Tooltip>
        </Flex>
        <Text>{comment.message}</Text>
      </Box>
    </Flex>
  );
};
