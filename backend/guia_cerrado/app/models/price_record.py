from app.extensions import db

class PriceRecord(db.Model):
    __tablename__ = 'price_records'

    id = db.Column(db.Integer, primary_key=True)
    culture_id = db.Column(db.Integer, db.ForeignKey('cultures.id'), nullable=False)
    city = db.Column(db.String(50), nullable=False)
    state = db.Column(db.String(2), nullable=False)
    price = db.Column(db.Float, nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'culture_id': self.culture_id,
            'city': self.city,
            'state': self.state,
            'price': self.price,
            'start_date': self.date.strftime('%Y-%m-%d'),
            'end_date': self.end_date.strftime('%Y-%m-%d')
        }
    
    def __repr__(self):
        return f'<PriceRecord for culture {self.culture_id} in {self.city}-{self.state} at {self.start_date}-{self.end_date}>'