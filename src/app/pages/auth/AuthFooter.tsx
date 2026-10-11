import React from 'react';
import { Box, Text } from 'folds';
import { APP_VERSION } from '../../../nightcord/brand';
import * as css from './styles.css';

export function AuthFooter() {
  return (
    <Box className={css.AuthFooter} justifyContent="Center" gap="400" wrap="Wrap">
      <Text as="a" size="T300" href="https://cinny.in" target="_blank" rel="noreferrer">
        About Cinny
      </Text>
      <Text
        as="a"
        size="T300"
        href="https://github.com/hanakokoizumi/cinny/releases"
        target="_blank"
        rel="noreferrer"
      >
        v{APP_VERSION}
      </Text>
      <Text as="a" size="T300" href="https://twitter.com/cinnyapp" target="_blank" rel="noreferrer">
        Twitter
      </Text>
      <Text as="a" size="T300" href="https://matrix.org" target="_blank" rel="noreferrer">
        Powered by Matrix
      </Text>
    </Box>
  );
}
