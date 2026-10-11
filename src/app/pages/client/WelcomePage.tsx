import React from 'react';
import { Box, Button, Icon, Icons, Text, config, toRem } from 'folds';
import { APP_NAME, APP_VERSION, APP_DESCRIPTION } from '../../../nightcord/brand';
import { logo } from '../../../nightcord/theme.css';
import { Page, PageHero, PageHeroSection } from '../../components/page';
import NightcordSVG from '../../../../public/res/svg/nightcord.svg';

export function WelcomePage() {
  return (
    <Page>
      <Box
        grow="Yes"
        style={{ padding: config.space.S400, paddingBottom: config.space.S700 }}
        alignItems="Center"
        justifyContent="Center"
      >
        <PageHeroSection>
          <PageHero
            icon={
              <img
                className={logo}
                width="70"
                height="70"
                src={NightcordSVG}
                alt="Nightcord Logo"
              />
            }
            title={`Welcome to ${APP_NAME}`}
            subTitle={
              <span>
                {APP_DESCRIPTION}{' '}
                <a
                  href="https://github.com/hanakokoizumi/cinny/releases"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  v{APP_VERSION}
                </a>
              </span>
            }
          >
            <Box justifyContent="Center">
              <Box grow="Yes" style={{ maxWidth: toRem(300) }} direction="Column" gap="300">
                <Button
                  as="a"
                  href="https://github.com/hanakokoizumi/cinny"
                  target="_blank"
                  rel="noreferrer noopener"
                  before={<Icon size="200" src={Icons.Code} />}
                >
                  <Text as="span" size="B400" truncate>
                    Source Code
                  </Text>
                </Button>
                <Button
                  as="a"
                  href="https://cinny.in/#sponsor"
                  target="_blank"
                  rel="noreferrer noopener"
                  fill="Soft"
                  before={<Icon size="200" src={Icons.Heart} />}
                >
                  <Text as="span" size="B400" truncate>
                    Support
                  </Text>
                </Button>
              </Box>
            </Box>
          </PageHero>
        </PageHeroSection>
      </Box>
    </Page>
  );
}
