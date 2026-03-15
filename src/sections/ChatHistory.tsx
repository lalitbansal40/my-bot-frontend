/* eslint-disable jsx-a11y/iframe-has-title */
import { useCallback, useEffect, useRef } from 'react';

// material-ui
import {
  Card,
  CardContent,
  Grid,
  Stack,
  Theme,
  Typography,
  Button,
  // Link
} from '@mui/material';

// project imports
import UserAvatar from './UserAvatar';

// types
import { UserProfile } from 'types/user-profile';
import { History } from 'types/chat';
import { ThemeMode } from 'types/config';

interface ChatHistoryProps {
  data: History[];
  theme: Theme;
  user: UserProfile;
}

const ChatHistory = ({ data, theme, user }: ChatHistoryProps) => {
  const wrapper = useRef(document.createElement('div'));
  const el = wrapper.current;

  const scrollToBottom = useCallback(() => {
    el.scrollIntoView(false);
  }, [el]);

  useEffect(() => {
    scrollToBottom();
  }, [data?.length, scrollToBottom]);

  const getReplyText = (msg: any) => {
    if (!msg) return "";

    const payload = msg.payload;

    return (
      payload?.bodyText ||
      payload?.text?.body ||
      payload?.interactive?.button_reply?.title ||
      payload?.interactive?.list_reply?.title ||
      payload?.options?.body ||
      payload?.text ||
      "Message"
    );
  };

  const ReplyPreview = ({ message }: any) => {
    if (!message) return null;

    return (
      <Stack
        sx={{
          borderLeft: "3px solid #25D366",
          pl: 1,
          mb: 1,
          background: "rgba(0,0,0,0.05)",
          borderRadius: 1,
          alignSelf: "flex-start"
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "normal",
            maxWidth: 260
          }}
        >
          {getReplyText(message)}
        </Typography>
      </Stack>
    );
  };

  const RenderFlowResponse = ({ response }: any) => {
    if (!response) return null;

    let data: any = {};

    try {
      data = JSON.parse(response);
    } catch (e) {
      return <Typography>{response}</Typography>;
    }

    return (
      <Stack spacing={1}>
        <Typography variant="body2" fontWeight={600}>
          Flow Response
        </Typography>

        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <tbody>
            {Object.entries(data).map(([key, value]: any) => (
              <tr key={key}>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: 6,
                    fontWeight: 600
                  }}
                >
                  {key}
                </td>

                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: 6
                  }}
                >
                  {String(value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Stack>
    );
  };

  // ==============================|| RENDER MESSAGE BY TYPE ||============================== //

  const RenderMessage = ({ history }: any) => {
    if (!history) return null;

    const type = history?.type;
    const payload = history?.payload;

    if (!type) return null;

    // TEXT
    if (type === 'text') {
      return <Typography>{payload?.text?.body}</Typography>;
    }

    if (type === 'location_request') {
      return (
        <Stack spacing={1}>
          <Typography
            variant="body2"
            sx={{
              whiteSpace: 'pre-line',
              lineHeight: 1.6
            }}
          >
            {payload?.text}
          </Typography>

          <Button
            variant="outlined"
            size="small"
            sx={{ width: 'fit-content' }}
          >
            Share Location
          </Button>
        </Stack>
      );
    }

    // BUTTON
    if (type === 'button') {
      return (
        <Stack spacing={1}>
          <Typography variant="body2"
            sx={{
              whiteSpace: 'pre-line',
              lineHeight: 1.6
            }}>{payload?.bodyText}</Typography>

          {payload?.buttons?.map((btn: any) => (
            <Button key={btn.id} variant="outlined"
              size="small"
              sx={{ width: 'fit-content' }}>
              {btn.title}
            </Button>
          ))}
        </Stack>
      );
    }

    // INTERACTIVE
    if (type === "interactive") {
      const buttonTitle = payload?.interactive?.button_reply?.title;

      if (buttonTitle) {
        return (
          <Button
            variant="outlined"
            size="small"
            sx={{
              width: "fit-content",
              pointerEvents: "none"
            }}
          >
            {buttonTitle}
          </Button>
        );
      }

      const flowResponse = payload?.interactive?.nfm_reply?.response_json;

      if (flowResponse) {
        return <RenderFlowResponse response={flowResponse} />;
      }

      return (
        <Typography
          variant="body2"
          sx={{
            whiteSpace: "pre-line",
            lineHeight: 1.6
          }}
        >
          {payload?.interactive?.nfm_reply?.body}
        </Typography>
      );
    }

    // LOCATION
    if (type === "location") {
      const lat = payload?.location?.latitude;
      const lng = payload?.location?.longitude;

      if (!lat || !lng) return null;

      return (
        <Stack spacing={1} sx={{ width: "100%" }}>
          <iframe
            width="100%"
            height="180"
            style={{ border: 0, borderRadius: 8 }}
            loading="lazy"
            src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
          />
        </Stack>
      );
    }

    // FLOW
    if (type === 'flow') {
      return (
        <Stack>
          <Typography variant="body2"
            sx={{
              whiteSpace: 'pre-line',
              lineHeight: 1.6
            }}>{payload?.options?.body}</Typography>
          <Button variant="outlined"
            size="small"
            sx={{ width: 'fit-content' }}>{payload?.options?.cta}</Button>
        </Stack>
      );
    }

    // CTA URL
    if (type === 'cta_url') {
      return (
        <Stack>
          <Typography variant="body2"
            sx={{
              whiteSpace: 'pre-line',
              lineHeight: 1.6
            }}>{payload?.bodyText}</Typography>

          <Button
            variant="outlined"
            size="small"
            sx={{ width: 'fit-content' }}
            href={payload?.url}
            target="_blank"
          >
            {payload?.buttonText}
          </Button>
        </Stack>
      );
    }

    return <Typography variant="body2"
      sx={{
        whiteSpace: 'pre-line',
        lineHeight: 1.6
      }}>Unsupported message</Typography>;
  };

  if (!data) return null;

  return (
    <Grid container spacing={2.5} ref={wrapper}>
      {data.map((history: any, index: number) => (
        <Grid item xs={12} key={index}>
          {history.direction !== 'IN' ? (
            <Stack spacing={1.25} direction="row">
              <Grid container spacing={1} justifyContent="flex-end">
                <Grid item xs={2} md={3} xl={4} />

                <Grid item xs={10} md={9} xl={8}>
                  <Stack direction="row" justifyContent="flex-end" alignItems="flex-start">
                    <Card
                      sx={{
                        display: 'inline-block',
                        float: 'right',
                        bgcolor: theme.palette.mode === ThemeMode.DARK
                          ? 'background.default'
                          : 'grey.100',
                        boxShadow: 'none',
                        ml: 1
                      }}
                    >
                      <CardContent sx={{ p: 1 }}>
                        <ReplyPreview message={history.reply_message} />

                        <RenderMessage history={history} />

                      </CardContent>
                    </Card>
                  </Stack>
                </Grid>

                <Grid item xs={12} display="flex" justifyContent="flex-end">
                  <Typography variant="caption">
                    {new Date(history.createdAt).toLocaleTimeString()}
                  </Typography>
                </Grid>
              </Grid>

              <UserAvatar
                user={{ online_status: 'available', avatar: 'avatar-1.png', name: 'User 1' }}
              />
            </Stack>
          ) : (
            <Stack direction="row" spacing={1.25}>
              <UserAvatar
                user={{ online_status: user.online_status, avatar: user.avatar, name: user.name }}
              />

              <Grid container spacing={1}>
                <Grid item xs={10} md={9} xl={8}>
                  <Card
                    sx={{
                      display: 'inline-block',
                      bgcolor:
                        theme.palette.mode === ThemeMode.DARK
                          ? 'background.default'
                          : 'grey.100',
                      boxShadow: 'none',
                      ml: 1,
                      maxWidth: 420,
                      width: "fit-content"
                    }}
                  >
                    <CardContent sx={{ p: 1 }}>
                      <ReplyPreview message={history.reply_message} />
                      <RenderMessage history={history} />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sx={{ mt: 1 }}>
                  <Typography variant="caption">
                    {new Date(history.createdAt).toLocaleTimeString()}
                  </Typography>
                </Grid>
              </Grid>
            </Stack>
          )}
        </Grid>
      ))}
    </Grid>
  );
};

export default ChatHistory;