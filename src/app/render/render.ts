import { Context } from '../context';
import { RenderCall } from './renderCall';

export class Render {

	private context: Context;
	private gl: WebGLRenderingContext;
	private shaderProgram: WebGLShader;

	private vertexBuffer: WebGLBuffer;
	private textureCoordBuffer: WebGLBuffer;
	private indeciesBuffer: WebGLBuffer;

	constructor(context: Context) {
		this.context = context;
		this.gl = context.gl;
		this.shaderProgram = context.shaderProgram;
	}

	public render(renderCalls: RenderCall[]) {
		var positionLocation = this.gl.getAttribLocation(this.shaderProgram, "a_position");
		this.gl.enableVertexAttribArray(positionLocation);
		var resolutionLocation = this.gl.getUniformLocation(this.shaderProgram, "u_resolution");
		var colorLocation = this.gl.getUniformLocation(this.shaderProgram, "u_color");
		var textureCoordAttribute = this.gl.getAttribLocation(this.shaderProgram, "a_texture_coord");
		this.gl.enableVertexAttribArray(textureCoordAttribute);
		this.gl.uniform1i(this.gl.getUniformLocation(this.shaderProgram, "u_sampler"), 0);

		for(let renderCall of renderCalls) {
			this.setBuffers(renderCall);

			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
			this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
			this.gl.uniform2f(resolutionLocation, renderCall.width, renderCall.height);

			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordBuffer);
			this.gl.vertexAttribPointer(textureCoordAttribute, 2, this.gl.FLOAT, false, 0, 0);

			this.gl.activeTexture(this.gl.TEXTURE0);
			this.gl.bindTexture(this.gl.TEXTURE_2D, renderCall.texture);
			this.gl.uniform1i(this.gl.getUniformLocation(this.shaderProgram, "u_sampler"), 0);

			this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indeciesBuffer);
			this.gl.drawElements(this.gl.TRIANGLES, renderCall.indecies.length, this.gl.UNSIGNED_SHORT, 0)
		}
	}

	private setBuffers(renderCall: RenderCall) {
		this.vertexBuffer = this.gl.createBuffer();
  		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);

  		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(renderCall.vertecies), this.gl.STATIC_DRAW);

  		this.textureCoordBuffer = this.gl.createBuffer();
  		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordBuffer);

  		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(renderCall.textureCoords), this.gl.STATIC_DRAW);

  		this.indeciesBuffer = this.gl.createBuffer();
  		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indeciesBuffer);

  		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(renderCall.indecies), this.gl.STATIC_DRAW);
	}

	
}