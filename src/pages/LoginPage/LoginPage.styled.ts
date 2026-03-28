import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';

const MOBILE_BP = '768px';

export const LoginRoot = styled(Box)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  padding: 16px;
`;

export const LoginCard = styled(Card)`
  && {
    width: 100%;
    max-width: 420px;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

    @media (max-width: ${MOBILE_BP}) {
      padding: 24px;
    }
  }
`;

export const LogoSection = styled(Box)`
  text-align: center;
  margin-bottom: 32px;
`;

export const LogoTitle = styled(Typography)`
  && {
    font-size: 28px;
    font-weight: 700;
    color: #0f172a;

    @media (max-width: ${MOBILE_BP}) {
      font-size: 24px;
    }
  }
`;

export const LogoSubtitle = styled(Typography)`
  && {
    font-size: 14px;
    color: #64748b;
    margin-top: 8px;
  }
`;

export const LogoDot = styled.span`
  color: #7c3aed;
  font-size: 32px;
`;

export const FormSection = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ErrorText = styled(Typography)`
  && {
    color: #ef4444;
    font-size: 14px;
    text-align: center;
  }
`;
