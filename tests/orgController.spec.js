const { describe, it, expect} = require('@jest/globals');
const { getOrganisations, getOrganisationById, createOrganisation, addUserToOrganisation } = require('../controllers/orgController');
const Organisation = require('../models/Organisation');
const User = require('../models/User');

jest.mock('../models/Organisation');
jest.mock('../models/User');

describe('Organisation Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getOrganisations', () => {
    it('should retrieve all organisations the user belongs to or created', async () => {
      const req = { user: { userId: 'some-user-id' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Organisation.findAll.mockResolvedValue([
        { orgId: '1', name: 'Org 1', description: 'Description 1' },
        { orgId: '2', name: 'Org 2', description: 'Description 2' }
      ]);

      await getOrganisations(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Organisations retrieved successfully',
        data: {
          organisations: [
            { orgId: '1', name: 'Org 1', description: 'Description 1' },
            { orgId: '2', name: 'Org 2', description: 'Description 2' }
          ]
        }
      });
    });

    it('should handle errors when retrieving organisations', async () => {
      const req = { user: { userId: 'some-user-id' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Organisation.findAll.mockRejectedValue(new Error('Database error'));

      await getOrganisations(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('getOrganisationById', () => {
    it('should retrieve a single organisation by orgId', async () => {
      const req = { params: { orgId: '1' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Organisation.findOne.mockResolvedValue({ orgId: '1', name: 'Org 1', description: 'Description 1' });

      await getOrganisationById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Organisation retrieved successfully',
        data: { orgId: '1', name: 'Org 1', description: 'Description 1' }
      });
    });

    it('should return 404 if organisation not found', async () => {
      const req = { params: { orgId: '1' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Organisation.findOne.mockResolvedValue(null);

      await getOrganisationById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Organisation not found' });
    });

    it('should handle errors when retrieving organisation by id', async () => {
      const req = { params: { orgId: '1' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Organisation.findOne.mockRejectedValue(new Error('Database error'));

      await getOrganisationById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('createOrganisation', () => {
    it('should create a new organisation', async () => {
      const req = { body: { name: 'New Org', description: 'New Org Description' }, user: { userId: 'creator-id' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Organisation.create.mockResolvedValue({ orgId: 'new-org-id', name: 'New Org', description: 'New Org Description' });

      await createOrganisation(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Organisation created successfully',
        data: { orgId: 'new-org-id', name: 'New Org', description: 'New Org Description' }
      });
    });

    it('should return 400 if organisation name is missing', async () => {
      const req = { body: { description: 'New Org Description' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await createOrganisation(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'Bad Request',
        message: 'Organisation name is required'
      });
    });

    it('should handle errors when creating an organisation', async () => {
      const req = { body: { name: 'New Org', description: 'New Org Description' }, user: { userId: 'creator-id' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Organisation.create.mockRejectedValue(new Error('Database error'));

      await createOrganisation(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('addUserToOrganisation', () => {
    it('should add a user to an organisation', async () => {
      const req = { body: { userId: 'new-user-id' }, params: { orgId: '1' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const organisation = { addMember: jest.fn() };
      Organisation.findOne.mockResolvedValue(organisation);

      await addUserToOrganisation(req, res);

      expect(organisation.addMember).toHaveBeenCalledWith('new-user-id');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'User added to organisation successfully'
      });
    });

    it('should return 404 if organisation not found', async () => {
      const req = { body: { userId: 'new-user-id' }, params: { orgId: '1' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Organisation.findOne.mockResolvedValue(null);

      await addUserToOrganisation(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Organisation not found' });
    });

    it('should handle errors when adding a user to an organisation', async () => {
      const req = { body: { userId: 'new-user-id' }, params: { orgId: '1' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Organisation.findOne.mockRejectedValue(new Error('Database error'));

      await addUserToOrganisation(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });
});