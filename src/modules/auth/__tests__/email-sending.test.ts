import { sendVerificationEmail } from '../../../utils/sendgrid.service';
import { sendPasswordResetEmail } from '../email.service';
import sgMail from '@sendgrid/mail';

// Mock SendGrid
jest.mock('@sendgrid/mail');

describe('Email Sending Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendVerificationEmail', () => {
    it('should call SendGrid with correct parameters', async () => {
      const mockSend = jest.fn().mockResolvedValue([{ statusCode: 202 }, {}]);
      (sgMail.send as jest.Mock) = mockSend;

      await sendVerificationEmail('test@my.csun.edu', 'test-token-123');

      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'test@my.csun.edu',
          from: expect.any(String),
          subject: 'Verify your email',
          text: expect.stringContaining('test-token-123'),
          html: expect.stringContaining('test-token-123'),
        })
      );
    });

    it('should throw error if SendGrid fails', async () => {
      const mockSend = jest.fn().mockRejectedValue(new Error('SendGrid error'));
      (sgMail.send as jest.Mock) = mockSend;

      await expect(
        sendVerificationEmail('test@my.csun.edu', 'test-token-123')
      ).rejects.toThrow();
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('should call SendGrid with correct password reset parameters', async () => {
      const mockSend = jest.fn().mockResolvedValue([{ statusCode: 202 }, {}]);
      (sgMail.send as jest.Mock) = mockSend;

      await sendPasswordResetEmail(
        'test@my.csun.edu',
        'reset-token-456',
        'John',
      );

      expect(mockSend).toHaveBeenCalledTimes(1);
      
      // Get the actual call to inspect it
      const callArgs = mockSend.mock.calls[0][0];
      
      // Verify email properties
      expect(callArgs.to).toBe('test@my.csun.edu');
      expect(callArgs.subject).toContain('Password Reset');
      expect(callArgs.text).toContain('John');
      expect(callArgs.text).toContain('reset-token-456');
      expect(callArgs.html).toContain('John');
      expect(callArgs.html).toContain('reset-token-456');
    });

    it('should throw error if SendGrid fails', async () => {
      const mockSend = jest.fn().mockRejectedValue(new Error('SendGrid error'));
      (sgMail.send as jest.Mock) = mockSend;

      await expect(
        sendPasswordResetEmail(
          'test@my.csun.edu',
          'reset-token-456',
          'John',
        )
      ).rejects.toThrow('Failed to send password reset email');
    });
  });
});