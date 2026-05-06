import { updateAppointmentStatus } from '@/app/actions/appointment';
import { client } from '@/lib/sanity';
import { revalidatePath } from 'next/cache';

// Mocks
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

jest.mock('@/lib/sanity', () => ({
  client: {
    withConfig: jest.fn(),
  },
}));

describe('Appointment Actions', () => {
  let mockCookies: any;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ADMIN_TOKEN = 'test-token';

    // Padrão: mocka que existe um cookie com o token válido
    mockCookies = require('next/headers').cookies;
    mockCookies.mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: 'test-token' }),
    });
  });

  it('should throw an error if the user is not authenticated', async () => {
    // Simula cookie ausente/inválido
    mockCookies.mockResolvedValue({
      get: jest.fn().mockReturnValue(null),
    });

    await expect(updateAppointmentStatus('123', 'confirmed')).rejects.toThrow('Acesso não autorizado');
  });

  it('should successfully update appointment status', async () => {
    // Mock do pipeline fluent do Sanity client: client.withConfig().patch().set().commit()
    const mockCommit = jest.fn().mockResolvedValue(true);
    const mockSet = jest.fn().mockReturnValue({ commit: mockCommit });
    const mockPatch = jest.fn().mockReturnValue({ set: mockSet });
    
    (client.withConfig as jest.Mock).mockReturnValue({
      patch: mockPatch,
    });

    const result = await updateAppointmentStatus('123', 'confirmed');

    expect(client.withConfig).toHaveBeenCalled();
    expect(mockPatch).toHaveBeenCalledWith('123');
    expect(mockSet).toHaveBeenCalledWith({ status: 'confirmed' });
    expect(mockCommit).toHaveBeenCalled();
    
    expect(revalidatePath).toHaveBeenCalledWith('/admin/agenda');
    expect(result).toEqual({ success: true });
  });

  it('should return success false if sanity update fails', async () => {
    const mockCommit = jest.fn().mockRejectedValue(new Error('Sanity API Error'));
    const mockSet = jest.fn().mockReturnValue({ commit: mockCommit });
    const mockPatch = jest.fn().mockReturnValue({ set: mockSet });
    
    (client.withConfig as jest.Mock).mockReturnValue({
      patch: mockPatch,
    });

    const result = await updateAppointmentStatus('123', 'confirmed');

    expect(result).toEqual({ success: false, error: 'Sanity API Error' });
  });
});
