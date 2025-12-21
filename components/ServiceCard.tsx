import WhatsAppButton from './WhatsAppButton';

interface ServiceCardProps {
  title: string;
  description: string;
  price: number;
  icon: React.ReactNode;
  isPriceCalculated?: boolean;
}

export default function ServiceCard({ 
  title, 
  description, 
  price, 
  icon,
  isPriceCalculated = false 
}: ServiceCardProps) {
  const whatsappMessage = `Hi! I'm interested in your ${title} service. Can you help me with a quote?`;

  return (
    <div className="card hover:shadow-xl transition-shadow duration-300">
      <div className="w-16 h-16 bg-turquoise-100 rounded-2xl flex items-center justify-center mb-4 text-turquoise-400">
        {icon}
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      
      <p className="text-gray-600 mb-4">{description}</p>
      
      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-sm text-gray-500">Starting at</span>
        <span className="text-3xl font-bold text-turquoise-400">${price}</span>
      </div>
      
      {isPriceCalculated ? (
        <a 
          href="/calculator" 
          className="btn-primary w-full text-center block"
        >
          Get Exact Quote
        </a>
      ) : (
        <WhatsAppButton 
          message={whatsappMessage}
          className="w-full"
        >
          Get a Quote
        </WhatsAppButton>
      )}
    </div>
  );
}

