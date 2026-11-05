/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { SessionsService } from './sessions.service';
import { getModelToken } from '@nestjs/mongoose';
import { Session } from './schemas/session.schema';
import { HttpService } from '@nestjs/axios';

describe('SessionsService', () => {
  let service: SessionsService;
  let mockSessionModel: any;
  let mockHttpService: any;

  beforeEach(async () => {
    // Mock de HttpService
    mockHttpService = {
      post: jest.fn(),
      delete: jest.fn(),
      get: jest.fn(),
    };

    // Mock de Mongoose Model
    mockSessionModel = {
      create: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
      deleteOne: jest.fn(),
      countDocuments: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        {
          provide: getModelToken(Session.name),
          useValue: mockSessionModel,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new session', async () => {
      const createSessionDto = {
        manufacturerKey: 'adobe',
        manufacturerName: 'Adobe',
        title: 'Adobe Photoshop Training',
        description: 'Advanced Photoshop training',
        admin: 'john@example.com',
        emails: ['user1@example.com'],
        requestDate: new Date(),
        scheduledDate: new Date(),
      };

      // TODO: Implementar lógica de test
    });
  });

  describe('findAll', () => {
    it('should return all sessions', async () => {
      // TODO: Implementar lógica de test
    });
  });

  describe('getStats', () => {
    it('should return session statistics', async () => {
      // TODO: Implementar lógica de test
    });
  });

  describe('createCalendlyEvent', () => {
    it('should create a calendly event', async () => {
      // TODO: Implementar lógica de test
    });
  });
});
