import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './user';

export class Incident extends Model {
  public id!: string;
  public userId!: string;
  public type!: string;
  public description!: string;
  public summary?: string;
}

Incident.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE', // Delete incidents if user is deleted
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    summary: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: 'Incident',
    tableName: 'incidents',
  }
);

// Associate models
User.hasMany(Incident, {
  foreignKey: 'userId',
  as: 'incidents',
});

Incident.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});
